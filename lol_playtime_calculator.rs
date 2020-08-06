use dotenv;

use riven::RiotApi;
use riven::consts::Region;

fn main() {
    check("Smuk".to_string());
    check("waterfall".to_string());
    check("like n love".to_string());
}

fn check(username: String) {
    let mut rt = tokio::runtime::Runtime::new().unwrap();
    rt.block_on(async {
        let api_key = dotenv::var("RIOT_API").unwrap();
        let riot_api = RiotApi::with_key(api_key);

        let summoner = riot_api.summoner_v4()
            .get_by_summoner_name(Region::NA, &username).await
            .expect("Get summoner failed.")
            .expect("There is no summoner with that name.");

        let masteries = riot_api.champion_mastery_v4()
            .get_all_champion_masteries(Region::NA, &summoner.id).await
            .expect("Get champion masteries failed.");

        let mut total_level: usize = 0;
        let mut total_exp: usize = 0;

        for (_i, mastery) in masteries[..masteries.len()].iter().enumerate() {
            // println!("{: >2}) {: <9}    {: >7} ({})", _i + 1,
            //     mastery.champion_id.to_string(),
            //     mastery.champion_points, mastery.champion_level);
            total_level += mastery.champion_level as usize;
            total_exp += mastery.champion_points as usize;
        }

        let etg_v1 = 20 * masteries.len() + ((total_level - masteries.len()) * 15);
        let etg_v2 = calculate_total_xp(summoner.summoner_level as usize) as f64 / 206.4;
        let etg_v3 = total_exp as f64 / 500.0;
        let weighted_average_v1 = (0.9*(etg_v1 as f64) + 1.2*(etg_v2 as f64) + 0.9*(etg_v3 as f64))/3.0;
        let weighted_average_v2 = ((etg_v2 as f64) + (etg_v3 as f64)) / 2.0;
        println!("Summoner name: {}", username);
        println!("Total hours played (estimate v1): {}", (etg_v1 as f64) * 0.5);
        println!("Total hours played (estimate v2): {}", etg_v2 * 0.5);
        println!("Total hours played (estimate v3): {}", (etg_v3 as f64) * 0.5);
        println!("Total hours played (weighted avg v1): {}", (weighted_average_v1 as f64) * 0.5);
        println!("Total hours played (weighted avg v2) (recommended): {}", (weighted_average_v2 as f64) * 0.5);
    });
}

fn calculate_total_xp(level: usize) -> u32 {
    let mut total_xp = 0;
    let xp_1_29 = [144,144,192,240,336,432,528,624,720,816,912,984,1056,1128,1344,1440,1536,1680,1824,1968,2112,2208,2448,2304,2496,2496,2592,2688,2688];
    let xp_30_49 = [2688,2688,2688,2784,2784,2784,2880,2880,2880,3072,3072,3168,3168,3264,3264,3360,3360,3456,3456,3456];
    let xp_every_25_from_50 = [2592,2688,2688,2688,2688,2880,2880,2880,3072,3072,3072,3264,3264,3264,3360,3360,3360,3456,3456,3456,3456,3552,3552,3648,3648];
    for i in 0..level {
        if i < 29 {
            //println!("Level {}: {}", i, xp_1_29[i]);
            total_xp += xp_1_29[i];
        } else if i < 49 {
            //println!("Level {}: {}", i, xp_30_49[i-29]);
            total_xp += xp_30_49[i-29];
        } else {
            //println!("Level {}: {}", i, xp_every_25_from_50[(i-49)%25]);
            total_xp += xp_every_25_from_50[(i-49)%25];
        }
    }
    total_xp

}
